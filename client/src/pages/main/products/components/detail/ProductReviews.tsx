import { useState, useEffect } from 'react';
import { Star, Image as ImageIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import API from '@/lib/axios';

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'with-images' | number>('all');

  // Fetch reviews
  useEffect(() => {
    console.log('Fetching reviews for productId:', productId);
    const fetchReviews = async () => {
      try {
        const response = await API.get(`/reviews/products/${productId}/reviews`);
        console.log('API Response:', response.data);
        // Xử lý nhiều trường hợp response structure
        const reviewsData = response.data.data || response.data || [];
        console.log('Reviews data:', reviewsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', (error as any)?.response?.status, (error as any)?.response?.data);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // Filter reviews
  useEffect(() => {
    let filtered = [...reviews];
    
    if (filter === 'with-images') {
      filtered = filtered.filter(review => review.images && review.images.length > 0);
    } else if (typeof filter === 'number') {
      filtered = filtered.filter(review => review.rating === filter);
    }
    
    setFilteredReviews(filtered);
  }, [reviews, filter]);

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: totalReviews > 0 
      ? (reviews.filter(review => review.rating === rating).length / totalReviews) * 100 
      : 0
  }));

  const reviewsWithImages = reviews.filter(review => review.images && review.images.length > 0).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>
      
      {totalReviews === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Star className="mx-auto h-16 w-16 mb-4 text-gray-300" />
          <p className="text-lg">Chưa có đánh giá nào</p>
          <p className="text-sm">Hãy là người đầu tiên đánh giá sản phẩm này</p>
        </div>
      ) : (
        <>
          {/* Tổng quan đánh giá */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 bg-gray-50 rounded-lg">
            {/* Rating trung bình */}
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center items-center mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{totalReviews} đánh giá</p>
            </div>

            {/* Phân bố theo sao */}
            <div className="space-y-2">
              {ratingCounts.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-xs text-gray-500 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bộ lọc */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Tất cả ({totalReviews})
            </Button>
            <Button
              variant={filter === 'with-images' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('with-images')}
            >
              <ImageIcon className="w-4 h-4 mr-1" />
              Có hình ảnh ({reviewsWithImages})
            </Button>
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingCounts.find(r => r.rating === rating)?.count || 0;
              return count > 0 ? (
                <Button
                  key={rating}
                  variant={filter === rating ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(rating)}
                >
                  {rating} sao ({count})
                </Button>
              ) : null;
            })}
          </div>

          {/* Danh sách đánh giá */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Không có đánh giá nào phù hợp với bộ lọc</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review._id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>

                    {/* Nội dung đánh giá */}
                    <div className="flex-1">
                      {/* Tên và rating */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.userId?.name || 'Ẩn danh'}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Nội dung */}
                      <p className="text-gray-700 mb-3">{review.comment}</p>

                      {/* Hình ảnh */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                              onClick={() => {
                                // TODO: Mở lightbox để xem ảnh lớn
                                window.open(image, '_blank');
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Thời gian */}
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductReviews; 