import prisma from "@/app/libs/prismadb";
import { gu } from "date-fns/locale";
import { start } from "repl";

// リスト表示のパラメーターを定義するインターフェース
export interface IListingsParams {
    userId?: string; // ユーザーID
    guestCount?: number; // ゲスト数
    roomCount?: number; // 部屋数
    bathroomCount?: number; // バスルーム数
    startDate?: string; // 開始日
    endDate?: string; // 終了日
    locationValue?: string; // 場所
    category?: string; // カテゴリー
}

// リスト表示関数
export default async function getListings(
    params: IListingsParams // パラメーターを受け取る
) {
    try {
        const { 
            userId, 
            guestCount,
            roomCount,
            bathroomCount,
            startDate,
            endDate,
            locationValue,
            category
        } = params;

        let query: any = {};

        if (userId) {
            query.userId = userId;
        }

        if (category){
            query.category = category;
        }

        if (roomCount) {
            query.roomCount = {
                gte: +roomCount // +をつけることで数値に変換する gteはgreater than or equal to
            }
        }
        if (guestCount) {
            query.guestCount = {
                gte: +guestCount // +をつけることで数値に変換する gteはgreater than or equal to
            }
        }
        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount // +をつけることで数値に変換する gteはgreater than or equal to
            }
        }

        if (locationValue) {
            query.locationValue = locationValue;
        }

        if (startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: { gte: startDate },
                                startDate: { lte: startDate }
                            },
                            {
                                startDate: { lte: endDate },
                                endDate: { gte: endDate }
                            }
                        ]
                    }
                }
            }
        }

        // データベースからリストを取得する
        const listings = await prisma.listing.findMany({
            orderBy: {
                createdAt: "desc"
            },
        });

        // 取得したリストを安全に表示するために、createdAtをISO形式に変換する
        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));

        return safeListings;

    } catch (error: any) {
        throw new Error(error);
    }
}
