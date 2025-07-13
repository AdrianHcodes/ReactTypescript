import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Rating,
  Select,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import MainLayout from "@/components/layouts/MainLayout";
import { useCarrito } from "@/hooks/useCarrito";
import { ProductType } from "@/modules/producto/types/productTypes";

const cantidades = Array.from({ length: 10 }, (_, i) => i + 1);

const DetalleProducto = () => {
  const router = useRouter();
  const { slug, idProducto } = router.query;

  const [producto, setProducto] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  const { agregarProducto } = useCarrito();

  useEffect(() => {
    if (!idProducto) return;

    setLoading(true);
    fetch(`https://dummyjson.com/products/${idProducto}`)
      .then((res) => res.json())
      .then((data) => setProducto(data))
      .catch((error) => console.error("Error al cargar producto:", error))
      .finally(() => setLoading(false));
  }, [idProducto]);

  return (
    <MainLayout titulo={producto ? producto.title : "Detalle producto"}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : producto ? (
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={4}>
            <Box component="img" src={producto.thumbnail} alt={producto.title} sx={{ width: "100%" }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                {producto.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {producto.description}
              </Typography>
              <Rating name="read-only" value={producto.rating} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Marca: {producto.brand}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4" fontWeight="medium">
                ${producto.price}
              </Typography>
              {producto.stock <= 5 && (
                <Typography variant="body2" color="error" mt={1}>
                  Solo quedan {producto.stock} unidades disponibles
                </Typography>
              )}
              <Typography variant="body2" mt={1}>
                Garantía: {producto.warrantyInformation || "No disponible"}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Dimensiones
                </Typography>
                <Typography variant="body2">Alto: {producto.dimensions?.height || "N/A"} in</Typography>
                <Typography variant="body2">Ancho: {producto.dimensions?.width || "N/A"} in</Typography>
              </Box>
            </CardContent>
          </Grid>

          <Grid item xs={12} md={2}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h4" fontWeight="bold">
                    ${producto.price}
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      size="small"
                      value={cantidad}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                    >
                      {cantidades.map((num) => (
                        <MenuItem key={num} value={num}>
                          {num}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      agregarProducto({
                        id: producto.id,
                        title: producto.title,
                        price: producto.price,
                        image: producto.thumbnail,
                        quantity: cantidad,
                      })
                    }
                  >
                    Agregar al carrito
                  </Button>
                  <Button variant="contained" color="primary">
                    Comprar ahora
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography>No se encontró el producto.</Typography>
      )}
    </MainLayout>
  );
};

export default DetalleProducto;
