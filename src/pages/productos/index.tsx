import MainLayout from "@/components/layouts/MainLayout";
import { useBusqueda } from "@/hooks/useBusqueda";
import { useCarrito } from "@/hooks/useCarrito";
import CardProducto from "@/modules/producto/components/CardProducto";
import { ProductType } from "@/modules/producto/types/productTypes";
import { Box, Pagination, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
//import { CircularProgress } from "@mui/material";


import SelectCategorias from "./selectCategorias";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

const calcularTotalPaginas = (total: number, limite: number) => {
  return Math.ceil(total / limite);
};

const calcularSkip = (pagina: number, limite: number) => {
  return (pagina - 1) * limite;
};

const Productos = () => {
  const [productos, setProductos] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(DEFAULT_PAGE);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const router = useRouter();

  const { agregarProducto } = useCarrito();
  const { busqueda } = useBusqueda();

  useEffect(() => {
    const skip = calcularSkip(pagina, DEFAULT_LIMIT);

    setLoading(true);
    fetch(
      `https://dummyjson.com/products/search?limit=${DEFAULT_LIMIT}&skip=${skip}&q=${busqueda}`
    )
      .then((res) => res.json())
      .then((datos) => {
        setProductos(datos.products);
        const total = calcularTotalPaginas(datos.total, DEFAULT_LIMIT);
        setTotalPaginas(total);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pagina, busqueda]);

  return (
  <MainLayout titulo="Productos">
    {/* Select para elegir categoría */}
    <SelectCategorias />

    <Box mb={4}>
      <Typography variant="subtitle1" fontWeight={"bold"}>
        Resultados
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Check each product page for other buying options
      </Typography>
    </Box>

    {loading && <Typography>Cargando productos...</Typography>}

    {!loading && (
      <>
        <Stack spacing={4}>
          {productos.map((producto) => (
            <CardProducto
              key={producto.id}
              producto={producto}
              onClick={(id) => {
                router.push(`/productos/${id}`);
              }}
              onAddToCart={(producto) => {
                agregarProducto({
                  id: producto.id,
                  title: producto.title,
                  price: producto.price,
                  image: producto.thumbnail,
                  quantity: 1,
                });
              }}
            />
          ))}
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 4,
          }}
        >
          <Pagination
            count={totalPaginas}
            variant="outlined"
            shape="rounded"
            onChange={(e, pagina) => setPagina(pagina)}
          />
        </Box>
      </>
    )}
  </MainLayout>
);}
export default Productos;