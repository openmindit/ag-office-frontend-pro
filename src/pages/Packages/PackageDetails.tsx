import {useEffect, useState} from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PackageListTable from "../../components/packages/PackageDataTable";
import {packageService} from "../../services/package.service";
import type {Package} from "../../types/api.types";

export default function PackageList() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchPackages = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await packageService.getPackages();
                if (isMounted) {
                    setPackages(Array.isArray(data.items) ? data.items : []);
                }
            } catch {
                if (isMounted) {
                    setError("Unable to load packages.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPackages();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <PageMeta title="Packages | AG Office" description="Packages catalogue"/>
            <PageBreadcrumb pageTitle="Packages"/>
            <PackageListTable packages={packages} loading={loading} error={error}/>
        </>
    );
}