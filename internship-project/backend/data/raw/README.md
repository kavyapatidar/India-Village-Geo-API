## Dataset Drop Folder

Put your original downloaded dataset file in this folder.

Recommended file naming:
- `mdds-master.xlsx`

Why this folder:
- keeps raw source files separate from code
- avoids confusion between sample JS data and real dataset files
- makes import scripts predictable (`backend/data/raw/...`)

Important:
- keep this file as the untouched source copy
- if needed, create cleaned copies in another folder later (for example `backend/data/processed/`)
