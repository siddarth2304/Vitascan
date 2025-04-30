

```markdown
# VitaScan

**VitaScan** is a covert smartphone app designed for crisis scenarios, such as hostage situations with jammed Wi-Fi or cellular networks. 🕵️‍♂️📵  
🏆 *Awarded 3rd Place at the Hackathon*, VitaScan disguises itself as a weather widget while using AI to detect people and weapons offline, relaying critical intel via a WebRTC-like mesh network. Built with a modern mobile tech stack, VitaScan ensures stealth and resilience, empowering hostages to provide real-time data to rescuers.

---

## 🚀 Features

### 🔐 Core Functionality
- **Covert Detection**: Uses mocked MobileNetV2 to detect people and weapons (e.g., *8 detected, 3 armed*).
- **Stealth Mode**: Operates as a fake weather widget ("Weather: 72°F, Sunny").
- **Offline Operation**: Uses a simulated WebRTC-like P2P mesh (~10–100m range).
- **Panic Alert**: Triple-tap gesture sends JSON alerts (e.g., `{people: 8, armed: 3}`).
- **Real-Time Updates**: Refreshes every 5 seconds, shown in UI or logged.

### ⚙️ Technical Features

#### Sensor Simulation
- **Camera**: Mocked 1080p input (~85% accuracy in production).
- **Microphone**: Simulated 16kHz input for weapon sound detection.

#### AI Processing
- **Mocked MobileNetV2**: Generates random JSON alerts (planned for on-device GPU like Snapdragon 888).

#### Mesh Network
- **Simulated WebRTC Mesh**: Mocked console logs visualize peer-to-peer relay.

#### UI Design
- Light gray metrics `#D1D5DB` on dark blue background `#1E3A8A`.
- Panic button: Red `#DC2626`, Stealth toggle: Teal `#0D9488`, Success alerts: Green `#16A34A`.

#### Scalability
- Extendable to **Briar** or **STUN/TURN-based** WebRTC for real mesh networking.

---

## 🛠 Tech Stack

### 📱 Frontend
- **React Native (0.74.x)** – Cross-platform mobile UI.
- **TypeScript** – Type-safe development.
- **Expo (51.x)** – Offline bundling and deployment.
- **React Native Vibration** – Haptic feedback.
- **StyleSheet** – Custom theming.

### 🧠 Data & Processing
- **Mocked MobileNetV2** – Simulated AI detection.
- **React Hooks** – State management (`useState`, `useEffect`).
- **AsyncStorage (Planned)** – Persistent data storage.

### 🔗 Communication
- **Simulated WebRTC** – Mesh logs in `VitaScanApp.tsx`.
- **Node.js/Express (Optional)** – Demo alert receiver.

### 📱 Hardware
- Any modern smartphone (iOS/Android) with:
  - 1080p camera
  - 16kHz microphone
  - On-device GPU (e.g., Snapdragon/Apple A-series)

---

### Live:  https://incandescent-cendol-ad930b.netlify.app

## 📦 Getting Started

### 🔧 Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- npm (v9+)
- Git
- [Expo Go](https://expo.dev/client)
- Smartphone: iOS (14+) or Android (8+)

### 🧪 Installation

```bash
git clone https://github.com/yourusername/vitascan.git
cd vitascan
npm install
npx expo start
```

- Scan the QR with **Expo Go** or run:
```bash
npx expo start --ios   # for iOS Simulator
npx expo start --android # for Android Emulator
```

- Check logs via:
```bash
npx expo start --no-dev-client
```

---

## 📲 Usage

- **Normal Mode**: Displays people/weapon detection.
- **Stealth Mode**: Weather UI disguises detection.
- **Panic Alert**: Triple-tap sends mesh alert with vibration.
- **Offline Mode**: Fully functional without internet.

---

## 📁 Project Structure

```
vitascan/
├── src/
│   ├── VitaScanApp.tsx             # Main app logic and UI
│   ├── components/
│   │   └── styles.ts               # StyleSheet definitions
│   └── assets/
│       └── mockData.json           # Optional mock data
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

---

## 🛣 Future Enhancements

- 🔍 Real sensors via `react-native-camera` and `react-native-audio`.
- 🧠 AI on-device (MobileNetV2 / YOLO-Nano via TensorFlow Lite).
- 🔗 Real mesh network with encryption (WebRTC/Briar).
- 💾 Persistent local buffer via AsyncStorage.
- 🎨 UI animations and accessibility polish.

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push and open a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Hackathon organizers and judges for the award 🥉  
- Team collaboration and late-night debugging 💡  
- Open-source communities: React Native, Expo, TypeScript  

---

> **VitaScan**: Covert, offline intelligence for crisis response. 📱🔒
```
