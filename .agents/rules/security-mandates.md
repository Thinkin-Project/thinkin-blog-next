---
trigger: always_on
---

# Security Non-Negotiables

- NEVER output API keys, passwords, or tokens in code.
- All user inputs (CLI args, HTTP requests) must be validated and sanitized.
- Do not use eval() or exec() under any circumstances.
