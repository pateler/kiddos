
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  MoreHorizontalIcon,
  SearchIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { videoService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface Video {
  _id: string;
  title: string;
  views: number;
  createdAt: string;
  uploadedBy: {
    _id: string;
    username: string;
  };
  isPublic: boolean;
}

interface AdminVideoListProps {
  videos: Video[];
  onDeleteVideo: (id: string) => void;
  refreshVideos: () => void;
}

const AdminVideoList: React.FC<AdminVideoListProps> = ({ 
  videos, 
  onDeleteVideo,
  refreshVideos
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredVideos = searchTerm 
    ? videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.uploadedBy.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : videos;

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await videoService.deleteVideo(id);
        toast({
          title: 'Video deleted',
          description: 'The video has been deleted successfully.',
        });
        onDeleteVideo(id);
      } catch (error: any) {
        console.error('Delete video error:', error);
        toast({
          title: 'Delete failed',
          description: error.response?.data?.message || 'Failed to delete video',
          variant: 'destructive',
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Video Management</h2>
        <div className="relative w-64">
          <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Uploader</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVideos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No videos found
                </TableCell>
              </TableRow>
            ) : (
              filteredVideos.map((video) => (
                <TableRow key={video._id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>{video.uploadedBy.username}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      video.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {video.isPublic ? 'Public' : 'Private'}
                    </span>
                  </TableCell>
                  <TableCell>{video.views}</TableCell>
                  <TableCell>{formatDate(video.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/videos/${video._id}`}>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/videos/${video._id}/edit`}>
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(video._id)}
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminVideoList;
