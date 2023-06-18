// このコードは、宿泊施設のカード表示を行うListingCardコンポーネントです。

// 必要なライブラリやコンポーネントをインポート
import { Listing, Reservation } from "@prisma/client";
import { SafeListing, SafeReservation, SafeUser } from "../../types";
import { useRouter } from "next/navigation";
import useCountries from "../../hooks/useCountries";
import { useCallback, useMemo } from "react";
import format from "date-fns/format";
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";

// Propsの型定義
interface ListingCardProps {
    data: SafeListing;
    reservation?: SafeReservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
}

// コンポーネントの定義
const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel = "",
    actionId = "",
    currentUser,
}) => {
    // nextjsのuseRouterをインスタンス化
    const router = useRouter();
    // Hookからユーティリティ関数getByValueを取得
    const { getByValue } = useCountries();

    // 都市名と国名を取得
    const location = getByValue(data.locationValue);

    // キャンセルボタンの処理
    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (disabled) {
                return;
            }

            onAction?.(actionId);
        },[onAction, disabled, actionId]);

    // 金額を計算
    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice;
        }

        return data.price;
    }, [reservation, data.price]);

    // 予約されている場合は、期間を計算
    const reservationData = useMemo(() => {
        if (!reservation) {
            return null;
        }

        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        return `${format(start, "PP")} - ${format(end, "PP")}`;
    }, [reservation]);

  return (
    <div
        onClick={() => router.push(`/listings/${data.id}`)}
        className="
            con-span-1
            cursor-pointer
            group
        "
    >
        <div className="flex flex-col gap-2 w-full">
            <div className="
                aspect-square
                w-full
                relative
                overflow-hidden
                rounded-xl
            ">
                <Image
                    fill
                    alt="Listing"
                    src={data.imageSrc}
                    className="
                        object-cover
                        h-full
                        w-full
                        group-hover:scale-110
                        transiton
                    "
                />
                <div className="absolute top-3 right-3">
                    <HeartButton
                        listingId={data.id}
                        currentUser={currentUser}
                    />
                </div>
            </div>
            <div className="font-semibold text-lg">
                {location?.region}, {location?.label}
            </div>
            <div className="font-light text-neutral-500">
                {reservationData || data.category}
            </div>
            <div className="flex flex-row items-center gap-1">
                <div className="semi-bold">
                    $ {price}
                </div>
                {!reservation && (
                    <div className="font-light">night</div>
                )}
            </div>
            {onAction && (
                <Button
                    disabled={disabled}
                    small
                    label={actionLabel}
                    onClick={handleCancel}
                />
            )}
        </div>
    </div>
  )
}

// コンポーネントのエクスポート
export default ListingCard;
