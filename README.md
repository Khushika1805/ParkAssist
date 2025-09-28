# ParkAssist — UMBC Parking Occupancy MVP
---

## Author

  Author:
    HackUMBC 2025 - Team GoGreen
    - Khushika Shah (kshah7@umbc.edu) 
    - Rajjya Rohan Paudyal (rajjyap1@umbc.edu)

**One-liner:** ParkAssist gives UMBC students a live, privacy-safe count of open parking spaces—shown as `Lot 22(A): free/total`—so they stop circling and get to class on time.

---

## Overview
- Classic OpenCV pipeline (no training/GPU): preprocess frame → count white pixels per slot → free vs occupied.
- Slot coordinates stored in a pickle file `CarParkPos` created by a simple picker tool.
- FastAPI backend publishes counts; ultra-simple frontend prints one line (e.g., `Lot 22(A): 13/150`).

## Tech Stack
- **Backend:** Python, FastAPI, OpenCV, NumPy
- **Frontend:** Plain HTML/JS (optional Leaflet badge UI later)
- **Runtime:** WSL2 Ubuntu (works on native Windows/macOS/Linux too)

## Repo Layout
```
ParkAssist/
├─ backend/
│  └─ main.py               # FastAPI server, processes video → counts → JSON + /summary
├─ frontend/
│  ├─ simple.html           # Shows "Lot 22(A): X/Y"
│  └─ (index.html)          # (optional) Leaflet map with badges
├─ media/
│  └─ carPark.mp4           # Sample video feed (replace with campus feed)
├─ CarParkPos               # Pickled list of (x,y) slot tops (made by picker)
├─ main.py                  # Original demo pipeline from the OpenCV repo
└─ ParkingSpacePicker.py    # Click to create/update CarParkPos
```

## Quick Start

### 0) System deps (video + GUI safety on WSL2)
```bash
sudo apt update
sudo apt install -y libgl1 libglib2.0-0 libsm6 libxext6 libxrender1 ffmpeg libgtk-3-0
```

### 1) Python env + deps
```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install fastapi "uvicorn[standard]" opencv-python numpy
```

### 2) Generate parking slots (if `CarParkPos` missing/outdated)
```bash
python ParkingSpacePicker.py
# Left-click to add slot top-left; Right-click to remove; auto-saves to CarParkPos
```

### 3) Run the backend (from repo root)
```bash
python -m uvicorn backend.main:app --reload --port 8000
# Endpoints:
#   GET /api/lots       -> [{"id","name","free","total","center","updatedAt"}]
#   GET /api/lots/22A   -> {"id","name","free","total","center","updatedAt"}
#   GET /summary        -> "Lot 22(A): X/Y"
```

### 4) Run the simple frontend
```bash
cd frontend
python -m http.server 5173
# open http://localhost:5173/simple.html
```

---

## Key Constants (tune as needed)
- `WIDTH=107`, `HEIGHT=48` — slot rectangle size (match your picker)
- `THRESHOLD=900` — pixel threshold separating **free** vs **occupied**
- Preprocess in backend mirrors original:
  - Gray → GaussianBlur(3×3, σ=1) → AdaptiveThreshold(25,16, INV) → MedianBlur(5) → Dilate(3×3, iter=1)

## Troubleshooting
- **`cv2.imshow` fails on WSL:** run backend only (no GUI needed) or install GTK and use `opencv-python` (not headless). The frontend shows the counts.
- **Video won’t open:** verify `media/carPark.mp4` exists and path resolution (use `pathlib` if running from `backend/`).
- **Wrong counts:** re-click slots with `ParkingSpacePicker.py` and/or adjust `THRESHOLD`.

## Roadmap
- Multiple lots (`LOTS` dict in backend) • polygon masks per slot • Leaflet map badges • health check (`/healthz`) • better error handling for video feeds • export historical CSV.

    9/27/2025
