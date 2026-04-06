---
description: Commit
---

Goal: Generate a single-line git commit message based on the current repository state.

Instructions:

1.  **Context Retrieval:** Automatically execute and analyze `git status` and `git diff` (prioritize `git diff --staged` if changes are staged) to gather the full context of the changes.

2.  **Zero-Friction:** Do not ask for permission to run git commands or read the diffs. Assume full authorization is granted and proceed immediately to analysis.

3.  **Analysis:** Focus on the high-level intent (the "why") rather than specific implementation details.

4.  **Synthesis:** Summarize the changes into a single, concise subject line.

Output: Provide ONLY the final one-line commit message.

Message Format: Refer to past cases.
