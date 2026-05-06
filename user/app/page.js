import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect the main hub to the unified login page so the project has a single entry URL.
  redirect('/login');
}
