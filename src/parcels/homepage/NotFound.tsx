export function NotFound({ data }: { data: Record<string, string> }) {
  return (
    <>
      {data?.tcg && (
        <p>
          TCG <code>{data?.tcg}</code> not found. Maybe it will be in the future.
        </p>
      )}
      {!data?.tcg && <p>404 - not found</p>}
    </>
  );
}
