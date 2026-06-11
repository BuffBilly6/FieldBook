import { Tractor, Fence, Sprout, Beef, Hammer, LineChart } from "lucide-react";

/* Bottom-nav tabs, in display order. */
export const TABS = [
  { id: "vehicles", label: "Vehicles", short: "Equip", icon: Tractor },
  { id: "fencing", label: "Fencing", short: "Fence", icon: Fence },
  { id: "fields", label: "Fields", short: "Fields", icon: Sprout },
  { id: "livestock", label: "Livestock", short: "Stock", icon: Beef },
  { id: "projects", label: "Projects", short: "Build", icon: Hammer },
  { id: "markets", label: "Markets", short: "Markets", icon: LineChart },
];

/* Form definitions for the four simple list tabs.
   `k` matches the database column name exactly. */
export const FORMS = {
  vehicles: [
    { k: "name", label: "Vehicle / Equipment", required: true, ph: "Kubota L3901" },
    { k: "task", label: "Maintenance task", ph: "Oil change, filter" },
    { k: "hours", label: "Hours / Mileage", ph: "1,250 hrs" },
    { k: "due", label: "Next service due", type: "date" },
    { k: "notes", label: "Notes", type: "textarea" },
  ],
  fencing: [
    { k: "name", label: "Fence run / Location", required: true, ph: "North pasture line" },
    { k: "length", label: "Length", ph: "400 ft" },
    { k: "material", label: "Material", ph: "5-strand high-tensile" },
    { k: "due", label: "Target completion", type: "date" },
    { k: "notes", label: "Notes", type: "textarea" },
  ],
  livestock: [
    { k: "name", label: "Animal / Group", required: true, ph: "Cow #14 / Layer flock" },
    { k: "task", label: "Action needed", ph: "Vaccinate, hoof trim" },
    { k: "head_count", label: "Head count", ph: "12" },
    { k: "due", label: "Due date", type: "date" },
    { k: "notes", label: "Notes", type: "textarea" },
  ],
  projects: [
    { k: "name", label: "Project", required: true, ph: "New equipment barn" },
    { k: "task", label: "Next step", ph: "Pour foundation" },
    { k: "est_cost", label: "Est. cost", ph: "$8,000" },
    { k: "due", label: "Target date", type: "date" },
    { k: "notes", label: "Notes", type: "textarea" },
  ],
};

export const STATUSES = ["todo", "in-progress", "done"];
export const STATUS_META = {
  todo: { label: "To Do", color: "#9a8c78" },
  "in-progress": { label: "Active", color: "#b45309" },
  done: { label: "Done", color: "#4d7c0f" },
};

/* Hay cycle states and their map polygon colors. */
export const HAY_STATES = ["growing", "ready", "cut"];
export const HAY_META = {
  growing: { label: "Growing", color: "#65a30d" },
  ready: { label: "Ready", color: "#f59e0b" },
  cut: { label: "Cut", color: "#a16207" },
};
export const FIELD_COLOR = "#65a30d"; // non-hay fields

/* Markets — commodity list shown on the Markets tab. */
export const COMMODITIES = [
  { name: "corn", label: "Corn", unit: "¢/bu", group: "Grains" },
  { name: "soybean", label: "Soybeans", unit: "¢/bu", group: "Grains" },
  { name: "wheat", label: "Wheat", unit: "¢/bu", group: "Grains" },
  { name: "live_cattle", label: "Live Cattle", unit: "¢/lb", group: "Cattle & Hogs" },
  { name: "feeder_cattle", label: "Feeder Cattle", unit: "¢/lb", group: "Cattle & Hogs" },
  { name: "lean_hogs", label: "Lean Hogs", unit: "¢/lb", group: "Cattle & Hogs" },
];

/* Sample prices shown ONLY when the live feed is unavailable —
   always labeled as sample data in the UI. */
export const SAMPLE_PRICES = {
  corn: { price: 425.75, prev: 431.0 },
  soybean: { price: 1150.5, prev: 1161.75 },
  wheat: { price: 562.25, prev: 558.5 },
  live_cattle: { price: 237.85, prev: 239.1 },
  feeder_cattle: { price: 342.57, prev: 340.2 },
  lean_hogs: { price: 98.4, prev: 97.15 },
};
