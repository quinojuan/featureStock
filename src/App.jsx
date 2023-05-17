import React, { useEffect, useState } from "react";
import XLSX from "xlsx/dist/xlsx.full.min.js";
import "./App.css";

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFile = () => {
    const file = "/productos.xls"; // Reemplaza 'nombre-del-archivo.xlsx' con el nombre de tu archivo Excel

    fetch(file)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const dataJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const filteredData = dataJson.filter((product) => {
          const productCode = product[0]?.toString(); // Obtén el código del producto de la primera columna

          // Realiza la comparación y devuelve true si el código del producto incluye el término de búsqueda
          return productCode && productCode.includes(searchTerm);
        });

        setJsonData(filteredData);
        console.log(jsonData);
      })
      .catch((error) => {
        console.error("Error al cargar el archivo:", error);
      });
  };

  useEffect(() => {
    handleFile();
  }, [searchTerm]);

  return (
    <div>
      <h1 className="title">HABÍA UNA VEZ</h1>
      <input
        className="code"
        type="text"
        placeholder=""
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm == "" ? (
        <p>Ingrese el código de un producto</p>
      ) : (
        jsonData && (
          <div>
            <pre>
              {jsonData.map((product, index) => (
                <div className="product" key={index}>
                  {product.slice(0, 4).map((item, idx) => (
                    <span className="items" key={idx}>
                      {item}{" "}
                    </span>
                  ))}
                </div>
              ))}
            </pre>
          </div>
        )
      )}
    </div>
  );
}

export default App;
