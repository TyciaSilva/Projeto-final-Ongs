import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/index";
import CadastroV from "./pages/Home/cadastroV";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<CadastroV />} />
      </Routes>
    </Router>
  );
}

export default App;