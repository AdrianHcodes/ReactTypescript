import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter } from "next/router";

// Tipo de categoría
interface Categoria {
  slug: string;
  name: string;
  url: string;
}

const SelectCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    const slug = event.target.value;
    setCategoriaSeleccionada(slug);
    router.push(`/productos/categoria/${encodeURIComponent(slug)}`);
  };

  return (
    <Box sx={{ minWidth: 250, mb: 3 }}>
      <FormControl fullWidth>
        <InputLabel id="categoria-select-label">Selecciona categoría</InputLabel>
        <Select
          labelId="categoria-select-label"
          value={categoriaSeleccionada}
          label="Selecciona categoría"
          onChange={handleChange}
        >
          {categorias.map((cat) => (
            <MenuItem key={cat.slug} value={cat.slug}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectCategorias;
