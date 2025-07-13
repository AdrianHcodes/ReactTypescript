import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Pagination,
  CircularProgress,
} from "@mui/material";
import MainLayout from "@/components/layouts/MainLayout";
import CardProducto from "@/modules/producto/components/CardProducto";
import { ProductType } from "@/modules/producto/types/productTypes";
import { useCarrito } from "@/hooks/useCarrito";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const calcularTotalPaginas = (total: number, limite: number) => {
  return Math.ceil(total / limite);
};

const calcularSkip = (pagina: number, limite: number) => {
  return (pagina - 1) * limite;
};

const CategoriaPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // const [todosLosProductos, setTodosLosProductos] = useState<ProductType[]>([]);
  const [productos, setProductos] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(DEFAULT_PAGE);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const { agregarProducto } = useCarrito();

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    fetch(`https://dummyjson.com/products/category/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const productos = data.products || [];
        // setTodosLosProductos(productos);

        const total = productos.length;
        setTotalPaginas(calcularTotalPaginas(total, DEFAULT_LIMIT));

        const skip = calcularSkip(pagina, DEFAULT_LIMIT);
        setProductos(productos.slice(skip, skip + DEFAULT_LIMIT));
      })
      .catch((error) => console.error("Error al cargar productos:", error))
      .finally(() => setLoading(false));
  }, [slug, pagina]);

  return (
    <MainLayout titulo={`Categoría: ${slug}`}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Productos en: {slug}
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {productos.length === 0 ? (
            <Typography>No hay productos para esta categoría.</Typography>
          ) : (
            <>
              <Stack spacing={4}>
                {productos.map((producto) => (
                  <CardProducto
                    key={producto.id}
                    producto={producto}
                    onClick={() =>
                      router.push(`/productos/categoria/${slug}/${producto.id}`)
                    }
                    onAddToCart={() =>
                      agregarProducto({
                        id: producto.id,
                        title: producto.title,
                        price: producto.price,
                        image: producto.thumbnail,
                        quantity: 1,
                      })
                    }
                  />
                ))}
              </Stack>

              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <Pagination
                  count={totalPaginas}
                  page={pagina}
                  onChange={(e, value) => setPagina(value)}
                  variant="outlined"
                  shape="rounded"
                />
              </Box>
            </>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default CategoriaPage;
