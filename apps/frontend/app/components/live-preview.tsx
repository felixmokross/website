import { useLivePreview } from "@payloadcms/live-preview-react";
import { type ReactNode } from "react";
import { useEnvironment } from "~/utils/environment";

export type OptInLivePreviewProps<TData> = {
  document: string;
  data: TData;
  depth: number;
  children: (data: TData) => ReactNode;
};

export function OptInLivePreview<TData>({
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

type LivePreviewProps<TData> = {
  data: TData;
  depth: number;
  children: (data: TData) => ReactNode;
};

function LivePreview<T>({ data, depth, children }: LivePreviewProps<T>) {
  const { payloadCmsBaseUrl } = useEnvironment();
  const { data: livePreviewData } = useLivePreview({
    initialData: data,
    serverURL: payloadCmsBaseUrl,
    depth,
  });
  return children(livePreviewData);
}
