// lib/dashboard/metrics.ts

import TransporterMetrics from "@/components/dashboard/metrics/transporter_metrics";
import GeneratorMetrics from "@/components/dashboard/metrics/generator_metrics";
import DisposerMetrics from "@/components/dashboard/metrics/disposer_metrics";
import RecyclerMetrics from "@/components/dashboard/metrics/recycler_metrics";
import { UserRole } from "../types";

export function getMetricsComponent(role?: UserRole) {
  switch (role) {
    case UserRole.Transporter:
      return <TransporterMetrics />;
    case UserRole.Generator:
      return <GeneratorMetrics />;
    case UserRole.Disposer:
      return <DisposerMetrics/>;
    case UserRole.Recycler:
      return <RecyclerMetrics/>;
    default:
      return null;
  }
}