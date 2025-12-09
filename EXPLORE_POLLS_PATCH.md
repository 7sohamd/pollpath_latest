# Manual Changes for ExplorePolls.tsx

Apply these changes manually to `d:\Downloads\agnik\VIDEOS\pollpath\components\ExplorePolls.tsx`:

## Change 1: Import isPro from useAuth (Line ~117)

**Find:**
```typescript
const { user } = useAuth();
```

**Replace with:**
```typescript
const { user, isPro } = useAuth();
```

---

## Change 2: Add Poll Filtering Logic (After line ~204, after `openPoll` function)

**Find:**
```typescript
  };

  // Filter Logic
  const displayedPolls = polls.filter(p =>
    p.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );
```

**Replace with:**
```typescript
  };

  // Separate public and private polls
  const publicPolls = polls.filter(p => p.visibility === 'public' && p.status !== 'deleted');
  const myPrivatePolls = user
    ? polls.filter(p => p.visibility === 'unlisted' && p.creatorId === user.uid && p.status !== 'deleted')
    : [];

  // Filter Logic - apply search only to public polls
  const displayedPolls = publicPolls.filter(p =>
    p.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );
```

---

## Change 3: Add "My Private Polls" Section (Before "Trending Section", around line ~328)

**Find:**
```typescript
        {/* Trending Section */}
        {filter === 'trending' && !searchQuery && (
```

**Add BEFORE that:**
```typescript
        {/* My Private Polls Section - Pro Users Only */}
        {isPro && myPrivatePolls.length > 0 && !searchQuery && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-purple-600 rounded-full" />
              <h2 className="text-2xl font-serif font-medium text-brand-900 flex items-center gap-2">
                My Private Polls
                <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-full">PRO</span>
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Your unlisted polls are hidden from Explore. Share the link to let others vote.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myPrivatePolls.map((poll) => (
                <div key={poll.id} className="relative">
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                    🔒 Private
                  </div>
                  <PollCard
                    poll={poll}
                    onClick={() => openPoll(poll)}
                    onVote={(optionIndex) => handleVote(poll.id, optionIndex)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Section */}
        {filter === 'trending' && !searchQuery && (
```

---

## Change 4: Update Trending Section to use publicPolls (Line ~337)

**Find:**
```typescript
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {polls.slice(0, 3).map((poll) => (
```

**Replace with:**
```typescript
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicPolls.slice(0, 3).map((poll) => (
```

---

## Summary of Changes

These changes will:
1. ✅ Hide unlisted polls from public Explore feed
2. ✅ Show "My Private Polls" section only to Pro users
3. ✅ Display private polls with a 🔒 badge
4. ✅ Still allow unlisted polls to be accessed via direct link (sharedPollId)

After applying, save the file and the changes will take effect immediately.
