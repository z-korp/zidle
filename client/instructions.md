# **Product Requirements Document (PRD) for zIdle**

## **Project Overview**

**zIdle** is an idle game where players farm resources to craft items using blueprints. Crafted items can either be traded or used to build machines that improve productivity. The ultimate goal is to craft a "crown," earning 1,000 victory points to win the game.

This PRD outlines the functionalities, technical requirements, file structure, and contextual examples to guide developers in implementing the project.

---

## **Core Functionalities**

### 1. **Farming Resources**

- **Objective**: Allow users to farm basic resources with a start/stop mechanism and visual feedback.
- **Features**:
  1.1. Players can toggle resource farming by clicking a button.  
  1.2. Button provides animation feedback while farming.  
  1.3. Resources increase progressively during farming.
  1.4. Experience (XP) for farming increases for each resource collected.

**Example Button Code (Draft):**

```tsx
<FarmingButton resourceType="wood" onStart={handleStart} onStop={handleStop} />
```

**Example API Response for Farming:**

```json
{
  "resource": "wood",
  "amount": 10,
  "experienceGained": 5
}
```

---

### 2. **Experience Bar**

- **Objective**: Display a progress bar showing XP levels for each resource.
- **Features**:
  2.1. Each resource has a dedicated XP bar.
  2.2. XP progresses based on farming activities.
  2.3. Display milestones (e.g., "Level 2 at 100 XP").

**Example XP Bar Component:**

```tsx
<ExperienceBar resourceType="wood" xp={50} level={2} />
```

---

### 3. **Craft Tab**

- **Objective**: Enable players to craft items from blueprints using their resources.
- **Features**:
  3.1. Display a list of available blueprints.  
  3.2. Each blueprint details the required resources.  
  3.3. Allow crafting only when sufficient resources are available.

**Example Blueprint API Response:**

```json
{
  "id": 1,
  "name": "Iron Pickaxe",
  "requiredResources": {
    "wood": 10,
    "iron": 5
  }
}
```

**Example Crafting Component Code:**

```tsx
<CraftTab availableResources={playerResources} blueprints={blueprints} />
```

---

### 4. **Craft Done Tab**

- **Objective**: Maintain a list of items already crafted.
- **Features**:
  4.1. Display a history of all crafted items.  
  4.2. Allow players to revisit crafted items and potentially reuse them.

---

### 5. **Marketplace**

- **Objective**: Allow players to trade resources and blueprints.
- **Features**:
  5.1. List resources and blueprints for sale.  
  5.2. Enable buying and selling using an in-game currency.  
  5.3. Provide filters for better user experience.

**Example Marketplace API Response:**

```json
[
  {
    "type": "resource",
    "name": "wood",
    "price": 5,
    "quantity": 100
  },
  {
    "type": "blueprint",
    "name": "Iron Pickaxe",
    "price": 20
  }
]
```

---

### 6. **Stats Panel**

- **Objective**: Display the player's progress for each resource.
- **Features**:
  6.1. Show levels, XP, and productivity rate for each resource.  
  6.2. Provide visual comparisons (e.g., bar charts).

**Example Stats API Response:**

```json
{
  "resources": [
    {
      "name": "wood",
      "level": 3,
      "xp": 120,
      "rate": "10/sec"
    },
    {
      "name": "iron",
      "level": 2,
      "xp": 80,
      "rate": "5/sec"
    }
  ]
}
```

---

## **File Structure**

```plaintext
client
├── .prettierrc.toml
├── index.html
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── src
│   ├── App.tsx                   // Main app component
│   ├── main.tsx                  // Entry point of the app
│   ├── index.css                 // Global styles
│   ├── components
│   │   ├── FarmingButton.tsx     // Button for farming resources
│   │   ├── ExperienceBar.tsx     // XP bar for resources
│   │   ├── CraftTab.tsx          // Blueprint selection and crafting
│   │   ├── CraftDoneTab.tsx      // List of crafted items
│   │   ├── Marketplace.tsx       // Buying and selling resources
│   │   ├── StatsPanel.tsx        // Display player stats
│   │   └── Layout.tsx            // Common layout component
│   ├── api
│   │   └── resourcesApi.ts       // API handlers for resources
│   ├── contexts
│   │   └── ResourcesContext.tsx  // Resource state management
│   ├── hooks
│   │   └── useResources.ts       // Resource management logic
│   ├── types
│   │   └── resources.ts          // TypeScript interfaces
│   ├── utils
│   │   ├── calculateXp.ts        // XP calculation logic
│   │   └── formatters.ts         // Helper functions
│   └── ui
│       └── animations.ts         // Animation utilities
└── public
    ├── assets                    // Static assets (images, icons)
    ├── favicon.ico
    └── fonts
```

---

## **Technical Requirements**

1. **Frontend Framework**: ReactJS with TypeScript.
2. **Styling**: TailwindCSS for a modern UI.
3. **Icons**: Lucid Icons for consistent iconography.
4. **Animations**: Use custom animations (defined in `ui/animations.ts`) for feedback.

---

## **API Documentation**

### 1. Farming Endpoint

### 2. Crafting Endpoint

---

## **Development Milestones**

1. **Core Farming Functionality**: Implement farming button and XP tracking.
2. **Crafting System**: Create the crafting tab and logic.
3. **Marketplace**: Develop buy/sell functionality.
4. **Stats Panel**: Build stats visualization.
5. **Polish**: Add animations and responsive UI.

---

This PRD provides a clear alignment for developers to deliver a well-structured, efficient, and scalable game application.
