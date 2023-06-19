import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListing";
import FavoritesClient from "./FavoritesClient";

const ListingPage = async () => {
  const listings = await getFavoriteListings();
  const user = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No favorites yet"
          subtitle="Click the heart on any home to start saving your favorite homes."
        />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <FavoritesClient 
        listings={listings}
        currentUser={currentUser}
      />
    </ClientOnly>
  )
};