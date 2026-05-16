import { useLivePreview } from "@payloadcms/live-preview-react";
import { type ReactNode } from "react";
import { useEnvironment } from "~/utils/environment";

export type OptInLivePreviewProps<TData extends object> = {
  document: string;
  data: TData;
  depth: number;
  children: (data: TData) => ReactNode;
};

export function OptInLivePreview<TData extends object>({
  children,
  document,
  data,
  depth,
}: OptInLivePreviewProps<TData>) {
  const { livePreviewDocument } = useEnvironment();

  return !!livePreviewDocument && livePreviewDocument === document ? (
    <LivePreview data={data} depth={depth}>
      {children}
    </LivePreview>
  ) : (
    children(data)
  );
}

type LivePreviewProps<TData extends object> = {
  data: TData;
  depth: number;
  children: (data: TData) => ReactNode;
};

function LivePreview<T extends object>({
  data,
  depth,
  children,
}: LivePreviewProps<T>) {
  const { payloadCmsBaseUrl } = useEnvironment();
  const { data: livePreviewData } = useLivePreview({
    initialData: data as Record<string, unknown>,
    serverURL: payloadCmsBaseUrl,
    depth,
  });
  return children(livePreviewData as T);
}
