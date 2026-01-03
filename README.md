# ⏳ Chronos

**Chronos** is a dynamic wallpaper generator that visualizes your life progress on your phone screen. Built as an open-source, beginner-friendly project with a focus on clean, well-documented code.

## 🌟 Features

- **Life Visualization**: See your life progress as dots on a grid
- **Two View Modes**:
  - **Year View**: Current year's 52 weeks
  - **Life View**: All 4,160 weeks of an 80-year lifespan
- **Device-Specific**: Supports 50+ phone models with exact screen resolutions
- **Dynamic Updates**: Wallpaper recalculates progress on each access
- **Automation Ready**: Step-by-step guides for iOS Shortcuts & Android MacroDroid
- **Customizable**: Choose your theme color
- **Privacy-First**: All data stored locally in your browser

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS
- **Image Generation**: @vercel/og
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
chronos/
├── app/
│   ├── page.tsx                 # Main application page
│   └── api/
│       └── wallpaper/
│           └── route.tsx        # Wallpaper generation API
├── components/
│   ├── BirthDateInput.tsx       # Birth date input component
│   ├── DeviceSelector.tsx       # Phone model selector
│   ├── ThemeColorPicker.tsx     # Color picker component
│   ├── ViewModeToggle.tsx       # Year/Life view toggle
│   └── SetupInstructions.tsx    # Automation setup guide
├── lib/
│   ├── types.ts                 # TypeScript type definitions
│   ├── devices.ts               # Phone models database
│   └── calcs.ts                 # Life progress calculations
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 How to Use

1. **Enter your birth date**: Input your birth date using the date picker
2. **Select your device**: Choose your phone model from the dropdown (50+ devices supported)
3. **Pick a theme color**: Select a preset color or use the custom color picker
4. **Choose view mode**: 
   - **Year View**: Shows current year's progress
   - **Life View**: Shows entire life progress
5. **Generate wallpaper URL**: Click the generate button to create your personalized wallpaper URL
6. **Set up automation**: Follow the iOS or Android instructions to automatically update your wallpaper daily

## 📊 How It Works

### Life Progress Calculation

Chronos uses a simple but powerful calculation:

- **Total Life Weeks**: 80 years × 52 weeks = **4,160 weeks**
- **Weeks Lived**: Calculated from your birth date to today
- **Life Percentage**: (Weeks Lived / 4,160) × 100

### Visualization

- **White dots**: Weeks you've lived
- **Dark gray dots**: Future weeks
- **Theme color**: Used for the percentage text

### Example

If you're 25 years old:
- Weeks lived: ~1,300
- Life percentage: ~31.3%
- Display: "31.3% to 90"

## 🤖 Automation Setup

### iOS (Shortcuts App)

1. Open Shortcuts app
2. Create new shortcut with "Get Contents of URL" action
3. Add "Set Wallpaper" action
4. Set up daily automation at midnight

Detailed instructions available in the app after generating your wallpaper URL.

### Android (MacroDroid)

1. Download MacroDroid from Play Store
2. Create macro with "Date/Time Trigger" (midnight)
3. Add "HTTP Request" action
4. Add "Set Wallpaper" action

Detailed instructions available in the app after generating your wallpaper URL.

## 🎨 Supported Devices

Chronos supports 50+ devices including:

- **Apple**: iPhone 12-16 series (all models)
- **Samsung**: Galaxy S20-S24 series (all variants)
- **Google**: Pixel 6-9 series (all models)
- **OnePlus**: 9-12 series
- **Xiaomi**: 12-14 series

Each device uses its exact native resolution for perfect wallpaper fit.

## 🧩 Code Philosophy

This project prioritizes **beginner-friendliness**:

- ✅ **Heavily commented code**: Every function explains what it does and why
- ✅ **Modular architecture**: Logic separated into clear, focused files
- ✅ **TypeScript strict mode**: Catch errors before they happen
- ✅ **JSDoc comments**: Mathematical formulas explained step-by-step
- ✅ **Clean separation of concerns**: UI, logic, and data are separate

## 🔧 Development

### Project Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Key Files to Understand

1. **lib/calcs.ts**: All life progress calculations with detailed math explanations
2. **lib/devices.ts**: Database of phone models and helper functions
3. **app/api/wallpaper/route.tsx**: Image generation logic using @vercel/og
4. **app/page.tsx**: Main UI with form handling and localStorage

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy with one click

Vercel automatically handles:
- Edge runtime for fast image generation
- Global CDN distribution
- Automatic HTTPS

### Environment Variables

No environment variables needed! The app works out of the box.

## 🤝 Contributing

Contributions are welcome! This is a beginner-friendly project.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style Guidelines

- Add JSDoc comments to all functions
- Use TypeScript strict mode
- Keep components focused and single-purpose
- Add comments explaining complex logic
- Follow existing naming conventions

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the concept of visualizing life as weeks
- Built with modern web technologies
- Designed for privacy and simplicity

---

**Made with ❤️ for anyone who wants to visualize their life journey**
