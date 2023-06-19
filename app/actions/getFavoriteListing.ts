// PrismaDBからお気に入りのリストを取得する関数
import prisma from "@/app/libs/prismadb";
// 現在のユーザーを取得する関数
import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    // 現在のユーザーを取得
    const currentUser = await getCurrentUser();

    // ユーザーが存在しない場合は空の配列を返す
    if (!currentUser) {
      return [];
    }

    // お気に入りのリストを取得
    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])]
        }
      }
    });

    // 安全なお気に入りのリストを作成
    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toISOString()
    }));

    // 安全なお気に入りのリストを返す
    return safeFavorites;
  } catch (error: any) {
    // エラーが発生した場合はエラーをスローする
    throw new Error(error);
  }
}
