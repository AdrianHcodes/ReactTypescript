//import { Box, Typography, Select, MenuItem, IconButton } from "@mui/material";
import { Box, Typography } from "@mui/material";
///import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Image from "next/image";
import React from "react";
import { CartProductType } from "../types/cartProductTypes";
import ActualizadorCantidad from "./ActualizadorCantidad";

interface ProductoCarritoProps {
  cartProduct: CartProductType;
  onUpdateQuantity: (idProducto: number, cantidad: number) => void;
  onDelete: (idProducto: number) => void;
}

const ProductoCarrito = ({
  cartProduct,
  onUpdateQuantity,
  onDelete,
}: ProductoCarritoProps) => {
  return (
    <Box textAlign={"center"} p={1}>
      <Image
        src={cartProduct.image}
        alt={cartProduct.title}
        width={120}
        height={120}
      />
      <Typography fontWeight={"bold"} mb={2}>
        ${cartProduct.price}
      </Typography>
      <ActualizadorCantidad
        value={cartProduct.quantity}
        onUpdateQuantity={(cantidad) => {
          onUpdateQuantity(cartProduct.id, cantidad);
        }}
        onDelete={() => onDelete(cartProduct.id)}
      />
    </Box>
  );
};

export default ProductoCarrito;
