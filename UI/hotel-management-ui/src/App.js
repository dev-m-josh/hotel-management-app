import "./App.css";
import Header from "./Components/Header";
import Meals from "./Components/Meals";

function App() {
  return (
    <>
      <Header />
      <div className="App">
        <Meals/>
      </div>
    </>
  );
}

export default App;
