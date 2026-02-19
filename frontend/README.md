# TaskFlow Frontend (Enterprise Extension)

## New pages added
- `/profile` – editable profile + stats panel
- `/admin` – super admin dashboard + audit export
- `/automation` – rule builder UI
- `/calendar` – monthly/weekly task calendar
- `/bookmarks` – bookmarked tasks/projects
- `/trash` – restore / force delete UI

## Existing pages upgraded
- Dashboard: colorful analytics visuals
- Project board: drag-and-drop kanban, multi-status flow, tag pills, due warnings
- Settings: notification preferences toggle
- Navbar: icon navigation, responsive mobile bottom nav, theme modes (light/dark/auto)

## New UI stack additions
- `lucide-react` icons
- `framer-motion` transitions
- `react-beautiful-dnd`
- FullCalendar (`@fullcalendar/*`)

## Setup
```bash
npm install
npm run dev
npm run build
```


## Troubleshooting
- If Vite says `Failed to resolve import "@fullcalendar/interaction"`, run:
  ```bash
  npm install @fullcalendar/interaction
  ```
- If you see JSX parse warnings, ensure your latest files are pulled and restart `npm run dev`.
