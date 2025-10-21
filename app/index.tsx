import { Redirect } from 'expo-router';

export default function Index() {
  // Force app to start at login
  return <Redirect href="/login" />;
}
