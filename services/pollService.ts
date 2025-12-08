import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Poll } from '../types';

const POLLS_COLLECTION = 'polls';

export const pollService = {
    // Create a new poll
    async createPoll(poll: Omit<Poll, 'id' | 'createdAt'>, userId: string): Promise<string> {
        const pollData = {
            ...poll,
            userId,
            createdAt: serverTimestamp(),
            totalVotes: 0,
        };

        const docRef = await addDoc(collection(db, POLLS_COLLECTION), pollData);
        return docRef.id;
    },

    // Fetch all polls
    async getPolls(): Promise<Poll[]> {
        const q = query(collection(db, POLLS_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const polls: Poll[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            polls.push({
                id: doc.id,
                ...data,
                createdAt: (data.createdAt as Timestamp)?.toDate?.() || new Date(),
            } as Poll);
        });

        return polls;
    },

    // Update poll vote - enforce one vote per user
    async votePoll(pollId: string, optionIndex: number, userId: string): Promise<void> {
        const pollRef = doc(db, POLLS_COLLECTION, pollId);

        // Get current poll data
        const polls = await this.getPolls();
        const poll = polls.find(p => p.id === pollId);

        if (!poll) throw new Error('Poll not found');

        const updatedOptions = [...poll.options];
        const updatedVoters = poll.voters || {};

        // Check if user has already voted
        let previousVoteIndex = -1;
        for (let i = 0; i < updatedOptions.length; i++) {
            if (updatedVoters[i]?.includes(userId)) {
                previousVoteIndex = i;
                break;
            }
        }

        // If user already voted for this option, do nothing
        if (previousVoteIndex === optionIndex) {
            return;
        }

        // Remove previous vote if exists
        if (previousVoteIndex !== -1) {
            updatedOptions[previousVoteIndex].votesCount -= 1;
            updatedVoters[previousVoteIndex] = updatedVoters[previousVoteIndex].filter(id => id !== userId);
        }

        // Add new vote
        updatedOptions[optionIndex].votesCount += 1;
        if (!updatedVoters[optionIndex]) {
            updatedVoters[optionIndex] = [];
        }
        updatedVoters[optionIndex].push(userId);

        // Calculate total votes
        const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votesCount, 0);

        await updateDoc(pollRef, {
            options: updatedOptions,
            voters: updatedVoters,
            totalVotes,
        });
    },

    // Delete a poll
    async deletePoll(pollId: string): Promise<void> {
        const pollRef = doc(db, POLLS_COLLECTION, pollId);
        await deleteDoc(pollRef);
    },
};