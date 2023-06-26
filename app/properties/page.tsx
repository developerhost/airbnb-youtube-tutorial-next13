// EmptyStateコンポーネントとClientOnlyコンポーネントをインポート
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

// getCurrentUser関数とgetReservations関数をインポートし、TripsClientクラスをインポート
import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";

// date-fnsのロケールをドイツに設定
import { de } from "date-fns/locale";
import PropertiesClient from "./PropertiesClient";

// TripsPage関数を宣言してエクスポート
const PropertiesPage = async () => {
  // currentUserにログイン中のユーザーを取得
  const currentUser = await getCurrentUser();

  // ログインしていない場合は、EmptyStateコンポーネントとClientOnlyコンポーネントを返す
  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState 
          title="Unauthorized"
          subtitle="Please login"
        />
      </ClientOnly>
    )
  }

  // currentUserの予約情報を取得
  const listings = await getListings({
    userId: currentUser.id,
  });

  // 予約がない場合は、EmptyStateコンポーネントとClientOnlyコンポーネントを返す
  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState 
          title="No properties"
          subtitle="You have no properties"
        />
      </ClientOnly>
    )
  }

  // 予約情報をTripsClientコンポーネントとClientOnlyコンポーネントで返す
  return (
    <ClientOnly>
      <PropertiesClient 
        listings={listings}
        currentUser={currentUser}
      />
    </ClientOnly>
  )
}

// TripsPage関数をデフォルトエクスポート
export default PropertiesPage
