import { z } from 'zod'

export const AdFormatsSchema = z.object({
  generic: z.number(),
  metric: z.string(),
  unknown: z.number(),
  vendorSpecific: z.number(),
})

export const ChannelsSchema = z.object({
  deprecated: z.number(),
  metric: z.string(),
  modeled: z.number(),
  unknown: z.number(),
})

export const BaseMetricSchema = z.object({
  metric: z.string(),
  modeled: z.number(),
  unknown: z.number(),
})

export const TotalMetricSchema = z.object({
  metric: z.string(),
  modeled: z.number(),
  skipped: z.number(),
})

export const CoverageSchema = z.object({
  adFormats: AdFormatsSchema,
  channels: ChannelsSchema,
  mediaOwners: BaseMetricSchema,
  properties: BaseMetricSchema,
  sellers: BaseMetricSchema,
  totalImpressions: TotalMetricSchema,
  totalRows: TotalMetricSchema,
})

export const PolicySchema = z.object({
  compliant: z.number(),
  noncompliant: z.number(),
  policy: z.string(),
  policyOwner: z.string(),
})

export const RowPolicySchema = z.object({
  compliant: z.boolean(),
  policy: z.string(),
  policyOwner: z.string(),
})

export const EmissionsTotalsSchema = z.object({
  adSelection: z.number(),
  creativeDelivery: z.number(),
  mediaDistribution: z.number(),
})

export const EmissionsBreakdownSchema = z.object({
  framework: z.string(),
  totals: EmissionsTotalsSchema,
})

export const AdFormatCoverageSchema = z.object({
  name: z.string(),
  value: z.string(),
  verified: z.boolean(),
})

export const SimpleValueSchema = z.object({
  value: z.string(),
})

export const ImpressionsSchema = z.object({
  modeled: z.number(),
  processed: z.number(),
  skipped: z.number(),
})

export const SupplyGraphDepthSchema = z.object({
  averageDepth: z.number(),
  maxDepth: z.number(),
  minDepth: z.number(),
})

export const SupplyGraphSchema = z.object({
  logical: SupplyGraphDepthSchema,
  technical: SupplyGraphDepthSchema,
  totalCount: z.number(),
})

export const RowCoverageSchema = z.object({
  adFormat: AdFormatCoverageSchema,
  channel: SimpleValueSchema,
  compensationProvider: SimpleValueSchema,
  impressions: ImpressionsSchema,
  property: SimpleValueSchema,
  supplyGraph: SupplyGraphSchema,
})

export const EmissionsComponentSchema = z.object({
  emissions: z.number(),
})

export const CompensationBreakdownSchema = z.object({
  emissions: z.number(),
  provider: z.string(),
})

export const CompensatedBreakdownStructSchema = z.object({
  compensation: CompensationBreakdownSchema,
})

export const CompensatedSchema = z.object({
  breakdown: CompensatedBreakdownStructSchema,
  total: z.number(),
})

export const SimpleBreakdownSchema = z.object({
  adPlatform: EmissionsComponentSchema,
  dataTransfer: EmissionsComponentSchema,
})

export const MediaDistributionBreakdownSchema = z.object({
  corporate: EmissionsComponentSchema,
  dataTransfer: EmissionsComponentSchema,
})

export const ComponentWithBreakdownSchema = z.object({
  breakdown: SimpleBreakdownSchema,
  total: z.number(),
})

export const MediaDistributionComponentSchema = z.object({
  breakdown: MediaDistributionBreakdownSchema,
  total: z.number(),
})

export const RowEmissionsBreakdownDetailSchema = z.object({
  adSelection: ComponentWithBreakdownSchema,
  compensated: CompensatedSchema,
  creativeDelivery: ComponentWithBreakdownSchema,
  mediaDistribution: MediaDistributionComponentSchema,
})

export const RowEmissionsBreakdownSchema = z.object({
  breakdown: RowEmissionsBreakdownDetailSchema,
  framework: z.string(),
})

export const PolicyEvaluationDataSchema = z.object({
  propertyId: z.number(),
  isMFA: z.boolean(),
  isInventory: z.boolean(),
  channel: z.string(),
  channelStatus: z.string(),
  benchmarksPercentile: z.number(),
})

export const InternalSchema = z.object({
  countryRegionGCO2PerKwh: z.number(),
  countryRegionCountry: z.string(),
  channel: z.string(),
  deviceType: z.string(),
  propertyId: z.number(),
  propertyInventoryType: z.string(),
  propertyName: z.string(),
  benchmarkPercentile: z.number(),
  isMFA: z.boolean(),
  policyEvaluationData: PolicyEvaluationDataSchema,
})

export const RowSchema = z.object({
  coverage: RowCoverageSchema,
  emissionsBreakdown: RowEmissionsBreakdownSchema,
  inventoryCoverage: z.string(),
  policies: z.array(RowPolicySchema),
  rowIdentifier: z.string(),
  totalEmissions: z.number(),
  internal: InternalSchema,
})

export const MeasureResponseSchema = z.object({
  coverage: CoverageSchema,
  policies: z.array(PolicySchema),
  requestId: z.string(),
  totalEmissions: z.number(),
  totalEmissionsBreakdown: EmissionsBreakdownSchema,
  rows: z.array(RowSchema),
})

export type AdFormats = z.infer<typeof AdFormatsSchema>
export type Channels = z.infer<typeof ChannelsSchema>
export type BaseMetric = z.infer<typeof BaseMetricSchema>
export type TotalMetric = z.infer<typeof TotalMetricSchema>
export type Coverage = z.infer<typeof CoverageSchema>
export type Policy = z.infer<typeof PolicySchema>
export type RowPolicy = z.infer<typeof RowPolicySchema>
export type EmissionsTotals = z.infer<typeof EmissionsTotalsSchema>
export type EmissionsBreakdown = z.infer<typeof EmissionsBreakdownSchema>
export type AdFormatCoverage = z.infer<typeof AdFormatCoverageSchema>
export type SimpleValue = z.infer<typeof SimpleValueSchema>
export type Impressions = z.infer<typeof ImpressionsSchema>
export type SupplyGraphDepth = z.infer<typeof SupplyGraphDepthSchema>
export type SupplyGraph = z.infer<typeof SupplyGraphSchema>
export type RowCoverage = z.infer<typeof RowCoverageSchema>
export type EmissionsComponent = z.infer<typeof EmissionsComponentSchema>
export type CompensationBreakdown = z.infer<typeof CompensationBreakdownSchema>
export type CompensatedBreakdownStruct = z.infer<
  typeof CompensatedBreakdownStructSchema
>
export type Compensated = z.infer<typeof CompensatedSchema>
export type SimpleBreakdown = z.infer<typeof SimpleBreakdownSchema>
export type MediaDistributionBreakdown = z.infer<
  typeof MediaDistributionBreakdownSchema
>
export type ComponentWithBreakdown = z.infer<
  typeof ComponentWithBreakdownSchema
>
export type MediaDistributionComponent = z.infer<
  typeof MediaDistributionComponentSchema
>
export type RowEmissionsBreakdownDetail = z.infer<
  typeof RowEmissionsBreakdownDetailSchema
>
export type RowEmissionsBreakdown = z.infer<typeof RowEmissionsBreakdownSchema>
export type PolicyEvaluationData = z.infer<typeof PolicyEvaluationDataSchema>
export type Internal = z.infer<typeof InternalSchema>
export type Row = z.infer<typeof RowSchema>
export type MeasureResponse = z.infer<typeof MeasureResponseSchema>
