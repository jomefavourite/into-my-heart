export function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}) {
  try {
    const url = new URL(path, 'intomyheart://app');
    if (url.hostname === 'expo-sharing') {
      return '/verses/import-verses';
    }

    return path;
  } catch {
    return path;
  }
}
