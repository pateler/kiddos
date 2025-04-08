import React from "react";
import Layout from "@/components/Layout";
import VideoFeatured from "@/components/VideoFeatured";
import { useQuery } from "@tanstack/react-query";
import VideoGrid from "@/components/VideoGrid";
import { videoService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { PlayCircleIcon, UploadIcon } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["videos", "homepage"],
    queryFn: async () => {
      const response = await videoService.getAllVideos();
      return response.videos;
    },
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to VideoVoyage
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover, upload, and share amazing videos from creators around
                the world.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Button asChild size="lg">
                  <Link to="/videos">
                    <PlayCircleIcon className="mr-2 h-5 w-5" /> Explore Videos
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/upload">
                    <UploadIcon className="mr-2 h-5 w-5" /> Upload Video
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <h2 className="text-2xl font-bold mb-6">Featured Video</h2>
                <VideoFeatured />
              </div>
              <div className="lg:w-1/3">
                <h2 className="text-2xl font-bold mb-6">Latest Uploads</h2>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-DEFAULT"></div>
                    </div>
                  ) : data && data.length > 0 ? (
                    data.slice(0, 3).map((video: any) => (
                      <Link
                        key={video._id}
                        to={`/videos/${video._id}`}
                        className="flex gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {video.thumbnailPath ? (
                            <img
                              src={video.thumbnailPath}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-brand-DEFAULT">
                              <PlayCircleIcon className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-1">
                            {video.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {video.uploadedBy.username}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No videos available
                    </p>
                  )}
                  <Button asChild variant="ghost" className="w-full">
                    <Link to="/videos">View All Videos</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default HomePage;
