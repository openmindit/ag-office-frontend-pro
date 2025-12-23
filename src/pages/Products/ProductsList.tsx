import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ProductListTable from "../../components/products/ProductListTable";
import { productService } from "../../services/product.service";
import type { ProductWithRelations } from "../../types/api.types";

export default function ProductsList() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError("Unable to load products.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <PageMeta
        title="Products | AG Office"
        description="Catalogue products list"
      />
      <PageBreadcrumb pageTitle="Products" />
      <ProductListTable products={products} loading={loading} error={error} />
    </>
  );
}