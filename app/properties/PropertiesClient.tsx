'use client'

// nextjsナビゲーションのuseRouterをインポート
import { useRouter } from "next/navigation";

// コンポーネントおよび型のインポート
import Container from "../components/Container";
import Heading from "../components/Heading";

// react hooksとaxios/react-hot-toastのインポート
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

import { SafeListing, SafeUser } from "../types";

// PropertiesClientPropsインターフェースの定義
interface PropertiesClientProps {
  listings?: SafeListing[];
  currentUser?: SafeUser | null;
}

// PropertiesClientコンポーネントの定義開始
const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  // useRouterのインスタンス化
  const router = useRouter();
  // 削除中の予約IDを保持するstate
  const [deletingId, setDeletingId] = useState('');

  // キャンセルボタンをクリックしたときの処理
  const onCancel = useCallback((id: string) => {
    // 削除中の予約IDを更新
    setDeletingId(id);

    // APIから予約をキャンセル
    axios.delete(`/api/listings/${id}`)
      .then(() => {
        // 正常にキャンセルされた場合はトースト通知を表示してページをリフレッシュ
        toast.success('Listing deleted');
        router.refresh();
      })
      .catch((error) => {
        // エラーが発生した場合はエラーメッセージをトースト通知で表示
        toast.error(error?.response?.data?.error);
      })
      .finally(() => {
        // 削除中の予約IDをクリア
        setDeletingId('');
      })
  }, [router])

  // JSXの描画
  return (
    <Container>
      <Heading 
        title="Properties"
        subtitle="List of your properties"
      />
      <div className="
        mt-10
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-8
      ">
        {listings?.map((listing) => (
          <ListingCard 
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onCancel}
            disabled={deletingId === listing.id}
            actionLabel="Delete"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  )
}

// PropertiesClientコンポーネントのエクスポート
export default PropertiesClient
