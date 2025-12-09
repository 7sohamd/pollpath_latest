import { getFirestore, admin } from '../_lib/firebase.js';

/**
 * Vercel Serverless Cron Function for Auto-Deleting Old Free Tier Polls
 * Triggered by Vercel Cron (configured in vercel.json)
 * GET /api/cron/cleanup-polls
 */
export default async function handler(req, res) {
    console.log('🕒 Running auto-delete cron job for free tier polls...');

    const db = getFirestore();

    if (!db) {
        console.log('⚠️  Skipping auto-delete: Firebase not configured');
        return res.status(503).json({
            error: 'Database not configured',
            message: 'Firebase Admin not initialized'
        });
    }

    try {
        // Delete polls older than 24 hours from free users
        const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const pollsSnapshot = await db.collection('polls')
            .where('ownerIsPro', '==', false)
            .where('createdAt', '<=', admin.firestore.Timestamp.fromDate(cutoffTime))
            .get();

        if (pollsSnapshot.empty) {
            console.log('✅ No free tier polls to delete');
            return res.json({
                success: true,
                deleted: 0,
                message: 'No free tier polls to delete'
            });
        }

        const batch = db.batch();
        let count = 0;

        pollsSnapshot.forEach((doc) => {
            // Soft delete: set status to 'deleted'
            batch.update(doc.ref, { status: 'deleted' });
            count++;
        });

        await batch.commit();
        console.log(`✅ Soft-deleted ${count} free tier polls older than 24 hours`);

        res.json({
            success: true,
            deleted: count,
            message: `Soft-deleted ${count} free tier polls older than 24 hours`
        });
    } catch (error) {
        console.error('❌ Error in auto-delete cron job:', error);
        res.status(500).json({
            error: 'Cron job failed',
            message: error.message
        });
    }
}
