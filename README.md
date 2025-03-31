
# FE-FastFood
## Read to instal app to local
## Prerequisites
Before running the application, ensure you have the following installed:

- **Node.js** (Latest LTS version recommended)
- **Yarn** (Package manager)
- **Android Studio** (For Android development)
- **React Native CLI** (Optional but recommended)

## Getting Started

### 1. Clone the Repository
Run the following command to clone the project to your local machine:
```bash
git clone <repository-url>
cd FE-FastFood
```

### 2. Configure Android SDK Path

Create a `local.properties` file inside the `android` folder and add the following line:
```properties
sdk.dir=C:\\Users\\Username\\AppData\\Local\\Android\\sdk
```
> Replace `Username` with your actual machine username.

### 3. Install Dependencies
Run the following command to install all required dependencies:
```bash
yarn install
```

### 4. Run the Application
To launch the application on an Android device or emulator, run:
```bash
yarn android
```
> Ensure that you have an Android emulator running or a real device connected.
if you run with real devices: use this cmd to run faster
> if you run with real devices: use this cmd to run faster
```bash
yarn android --active-arch-only
```



