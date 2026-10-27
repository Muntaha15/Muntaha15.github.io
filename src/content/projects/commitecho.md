---
title: CommitEcho
description: A local MCP server and CLI that records the decisions behind code changes and helps coding agents recall why they were made.
date: 2026-09-29
updated: 2026-10-29
tags: [Agentic AI, MCP, Python, Git]
featured: true
order: 1
repo: https://github.com/Muntaha15/CommitEcho
release: https://github.com/Muntaha15/CommitEcho/releases/tag/v0.2.0
kind: Agentic systems
draft: false
---

## Remembering why code changed

On long-running projects with coding agents, I could find the code change more easily than the reason behind it. Recovering that reasoning also slowed later reviews.

I built CommitEcho so a developer or coding agent can recover those decisions alongside the code.

## How it works

CommitEcho runs locally as a Python Model Context Protocol (MCP) server and command-line tool. In a configured agent workflow, a skill guides the agent to record the problem, choice, alternatives, and reasons. Drafts stay private until selected records are linked to a Git commit through a `CommitEcho-Record` trailer. A SQLite FTS5 index supports searches within a chosen revision's history and can be rebuilt after cloning the repository.

## A decision from the project itself

CommitEcho uses its own workflow. In [commit bf162c5](https://github.com/Muntaha15/CommitEcho/commit/bf162c52e3adacf3f654e49e483eee967f3197f5), a [published decision record](https://github.com/Muntaha15/CommitEcho/blob/bf162c52e3adacf3f654e49e483eee967f3197f5/.commitecho/records/1e604be7-d723-47e0-949c-08d13f1b14fe.json) captures why an integration test needed to exercise the actual MCP transport.

Selected fields from that record’s decision:

| Field | Recorded value |
| --- | --- |
| `problem` | Existing stdio smoke tests cover startup and status, while the code-change lifecycle is tested through services directly. |
| `choice` | Add one regression test exercising all eight tools over stdio with a runnable code change, commit verification, indexing, and recall after server restart. |
| `rationale` | Validate the MCP SDK v2 migration through the actual transport and retain a runnable check for future changes. |

After cloning the repository and installing CommitEcho, run these commands from the repository directory to inspect the record:

```bash
commitecho index
commitecho show 1e604be7-d723-47e0-949c-08d13f1b14fe
```

With the MCP server connected, a coding agent can find it by the affected file and retrieve the full record:

```text
search_history(path="tests/integration/test_setup.py")
get_evidence(record_id="1e604be7-d723-47e0-949c-08d13f1b14fe")
```

The committed record connects the testing decision to its code, so a later review can recover the reason for adding the test.

## My contribution

I built the decision-record workflow, Git binding and verification, and a searchable SQLite FTS5 index. The design separates private working drafts from records selected for publication, so unfinished reasoning does not have to become part of the repository.

Three design choices shape the project:

- **Decisions linked to code:** Verification checks the relationship between a record, its Git commit, and the code fingerprint, including partial commits.
- **History that travels with the repository:** A fresh clone can rebuild the search index from committed records without the original local database.
- **Setup across coding environments:** Configuration profiles support Claude Code, Codex, Antigravity, and Copilot in VS Code.

## Release and validation

[v0.2.0](https://github.com/Muntaha15/CommitEcho/releases/tag/v0.2.0) was published on October 5, 2026, on GitHub and [PyPI](https://pypi.org/project/commitecho/0.2.0/) under the MIT License. It requires Python 3.12+ and uses Click, Pydantic, and the MCP Python SDK.

Each of the four Windows/Linux [CI jobs](https://github.com/Muntaha15/CommitEcho/actions/runs/37295620605) passed 421 tests with zero skips. Additional package checks covered capture and recall, recovery after restarting, and indexing a fresh clone.

## Limits

Search matches words and paths rather than meaning. Verification checks a record's link to Git, not the truth of its reasoning. Records need review before publication because sensitive-content filters can miss private details. Client validation is documented in the release notes; interactive Copilot use remains untested.

## Explore the implementation

- [v0.2.0 Release on GitHub](https://github.com/Muntaha15/CommitEcho/releases/tag/v0.2.0)
- [PyPI package (commitecho 0.2.0)](https://pypi.org/project/commitecho/0.2.0/)
- [Source code and setup](https://github.com/Muntaha15/CommitEcho)
- [Architecture & CLI documentation](https://github.com/Muntaha15/CommitEcho/blob/main/README.md)
- [Release notes & validation scope](https://github.com/Muntaha15/CommitEcho/blob/main/RELEASE_NOTES.md)
