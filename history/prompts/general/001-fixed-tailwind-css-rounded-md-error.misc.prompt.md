---
id: 001
title: Fixed Tailwind CSS rounded-md error
stage: misc
date_iso: 2026-02-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-ui-components
user: unknown
command: /sp.phr
labels: ["tailwind-css", "configuration", "bug-fix", "ui"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - /mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/postcss.config.mjs
  - /mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/tailwind.config.ts
  - /mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/package.json
tests_yaml:
  - none
---

## PROMPT_TEXT

solve this error quick and properly     [at un (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:38:294)]
    [at process.processTicksAndRejections (node:internal/process/task_queues:95:5)]
    [at async cn (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:38:631)]
    [at async Xr (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/@tailwindcss/node/dist/index.js:10:3417)]
Error: Cannot apply unknown utility class `rounded-md`. Are you using CSS modules or similar and missing `@reference`? https://tailwindcss.com/docs/functions-and-directives#reference-directive
    [at onInvalidCandidate (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:21:1314)]
    [at Te (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:16:36652)]
    [at /mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:21:355]
    [at Rr (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:3:1718)]
    [at _ (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:3:1377)]
    [at $e (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:21:172)]
    [at un (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:38:294)]
    [at process.processTicksAndRejections (node:internal/process/task_queues:95:5)]
    [at async cn (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:38:631)]
    [at async Xr (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/@tailwindcss/node/dist/index.js:10:3417)]
Error: Cannot apply unknown utility class `rounded-md`. Are you using CSS modules or similar and missing `@reference`? https://tailwindcss.com/docs/functions-and-directives#reference-directive
    [at onInvalidCandidate (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:21:1314)]
    [at Te (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:16:36652)]
    [at /mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:21:355]
    [at Rr (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:3:1718)]
    [at _ (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:3:1377)]
    [at $e (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:21:172)]
    [at un (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:38:294)]
    [at process.processTicksAndRejections (node:internal/process/task_queues:95:5)]
    [at async cn (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/tailwindcss/dist/lib.js:38:631)]
    [at async Xr (/mnt/d/Quarter_4/Hackathon_2/Todo_AI_Chatbot/frontend/node_modules/@tailwindcss/node/dist/index.js:10:3417)]

## RESPONSE_TEXT

Fixed the Tailwind CSS error by changing from the experimental @tailwindcss/postcss plugin back to the standard tailwindcss plugin and updating the content configuration to ensure all relevant files are scanned.

## OUTCOME_IMPACT

Resolved the "Cannot apply unknown utility class `rounded-md`" error by correcting the Tailwind CSS configuration that was using an incompatible plugin.

## TESTS_SUMMARY

None - configuration changes only

## FILES_SUMMARY

Modified postcss.config.mjs, tailwind.config.ts, and package.json to fix the Tailwind CSS configuration issue.

## NEXT_PROMPTS

None needed - issue resolved

## REFLECTION_NOTE

The issue was caused by using the experimental @tailwindcss/postcss plugin which had stricter class validation. Switching back to the standard plugin resolved the issue.

## EVALUATION

Failure modes observed: Permission issues prevented full dependency reinstallation, but configuration changes were sufficient to resolve the issue.

Next experiment to improve prompt quality: When encountering permission issues with node_modules, focus on configuration changes that don't require dependency installation.