import './App.css';
import './shared/styles/wizard.css';
import ThemeProvider from './shared/providers/ThemeProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import Screen from './components/Screen';
import KeyboardMapProvider from './shared/providers/KeyboardMapProvider';
import ScreenContext from './shared/providers/ScreenContext';
import ExportKeymapModal from './components/ExportKeymapModal';
import useKeyboard from './shared/hooks/useKeyboard';
import useKeyboardMap from './shared/hooks/useKeyboardMap';

function App() {
  const keyboardMap = useKeyboardMap();
  const keyboard = useKeyboard({
    isMappingKey: keyboardMap.isMappingKey,
    getTargetKeymap: keyboardMap.getTargetKeymap,
    getSourceKeymap: keyboardMap.getSourceKeymap,
    sourceLayout: keyboardMap.sourceLayout,
    targetLayout: keyboardMap.targetLayout,
  });

  return (
    <ThemeProvider>
      <ScreenContext.Provider value={keyboard}>
        <KeyboardMapProvider
          keyboardMap={keyboardMap}
          pressedKeyIndex={keyboard.pressedKeyIndex}
        >
          <Header />
          <Screen />
          <ExportKeymapModal />
          <Footer />
        </KeyboardMapProvider>
      </ScreenContext.Provider>
    </ThemeProvider>
  );
}

export default App;
