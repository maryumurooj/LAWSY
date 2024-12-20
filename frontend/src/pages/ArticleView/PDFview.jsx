import './App.css';
import PDFViewer from './components/PDFViewer';
import PDFJSBackend from './backends/pdfjs';
 

function App() {
  return (
    <div className="App">
      <PDFViewer 
        backend={fileURL}
        src='/myPDF.pdf'
      />
    </div>
  );
}

export default App;
