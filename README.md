# Perfect Sensitivity Finder for Valorant

A web-based sensitivity calculator that uses TenZ's proven binary search method to help Valorant players find their optimal mouse sensitivity.

## Features

- 🎯 Binary search algorithm for precise sensitivity finding
- 📊 Visual progress tracking and binary search visualization
- 💾 DPI history storage for quick access
- 🎨 Modern glass morphism UI design
- 📱 Fully responsive design
- ✨ Smooth GSAP animations
- 🎮 Based on professional player data (280 eDPI average)

## How It Works

1. **Enter your mouse DPI** - Input your current mouse DPI setting
2. **Test base sensitivity** - Try the calculated base sensitivity (280 eDPI)
3. **Binary search refinement** - Use feedback to narrow down your perfect sensitivity
4. **Get optimized result** - Receive your personalized sensitivity settings

## Usage

Simply open `index.html` in your browser. No installation required!

## Method

This tool implements the sensitivity finding method shared by TenZ:

- Starts with average pro player eDPI (280)
- Creates upper and lower bounds (×1.5 and ÷1.5)
- Uses binary search to systematically narrow down the perfect sensitivity
- Completes in maximum 7 iterations

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS for styling
- GSAP for animations
- Modern browser APIs

## Browser Support

Works on all modern browsers that support:

- CSS Grid and Flexbox
- ES6+ JavaScript features
- HTML5 video element

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or educational purposes.

---

_This project is not affiliated with Riot Games or Valorant._
