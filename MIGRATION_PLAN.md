# Migration Plan: Move uploads out of Git and into Azure Blob Storage

Goal: Remove large user-uploaded files from the repository history, migrate files to Azure Blob Storage, and update database records to reference blob URLs.

High-level steps:

1) Inventory files
   - List files under `Zenith-OG/public/uploads/` and tally total size.
   - Identify any other large files accidentally committed.

2) Create an Azure Blob container
   - Create a storage account and a container (see README Azure section for quick commands).

3) Upload files to Blob Storage
   - Use `az storage blob upload-batch --account-name <acct> -s Zenith-OG/public/uploads -d uploads` to copy files.

4) Update DB references
   - For each product/user record referencing `/public/uploads/...`, update to the new blob URL: `https://<account>.blob.core.windows.net/uploads/<path>`.
   - Prefer doing this in a script and validating records before replacing.

5) Remove files from git history (destructive; coordinate with team)
   - Recommended: use `git filter-repo` (fast and maintained) or BFG.
   - Example using git filter-repo (requires installation):

```bash
# create a backup clone
git clone --mirror git@github.com:org/repo.git repo-mirror.git
cd repo-mirror.git

# remove the uploads folder
git filter-repo --path Zenith-OG/public/uploads --invert-paths

# push the rewritten history (force)
git push --force --all
git push --force --tags
```

Important notes:
- Rewriting history is destructive for collaborators — coordinate and plan a cutover window.
- Keep a backup of the original repo mirror in case of mistakes.
- After history rewrite, local clones must reclone or run `git fetch origin && git reset --hard origin/main`.

6) Add `.gitignore` entry (already added) to prevent future commits of uploads.

7) Verify and cleanup
   - Confirm blob URLs work in app and images load.
   - Run a full CI build and manual smoke tests.

Optional: Use a migration script to copy blobs and update DB atomically. For large datasets consider doing this in batches.
