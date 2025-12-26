import { Navigate, useParams } from "react-router"
import useGetPlaylist from "../../hooks/useGetPlaylist"
import LoadingSpinner from "../../common/components/LoadingSpinner"
import ErrorMessage from "../../common/components/ErrorMessage"
import styles from "./PlaylistDetailPage.module.css"
import { MusicNoteOutlined } from "@mui/icons-material"
import useGetCurrentUserProfile from "../../hooks/useGetCurrentUserProfile"

const PlaylistDetailPage = () => {
  const {id} = useParams<{id:string}>()
  if(id === undefined) return <Navigate to="/"/>
  const { data: userProfile } = useGetCurrentUserProfile()
  const {data:playlist, isLoading, error} = useGetPlaylist({playlist_id: id})
  console.log("playlist", playlist)

  if (isLoading) return <LoadingSpinner/>
  if (error) return <ErrorMessage errorMessage={error.message}/>
  if (!playlist) return <div>Playlist not found</div>

  const formatDuration = (totalMs: number): string => {
  const hours = Math.floor(totalMs / 1000 / 60 / 60);
  const minutes = Math.floor((totalMs / 1000 / 60) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);
  
  if (hours > 0) {
    return `${hours} hour ${minutes} min ${seconds} sec`;
    }
    return `${minutes} min ${seconds} sec`;
  };

  const totalDuration = playlist?.tracks?.items
    ?.reduce((sum, item) => sum + (item.track.duration_ms || 0), 0) || 0;

  const hasImage = playlist.images && playlist.images.length > 0
  return (
    <div className={styles.container} >
      <div className={styles.header}>
        <div className={styles.imageContainer}>
          {hasImage ? (
            <img src={playlist.images?.[0]?.url} alt={playlist.name} />
          ) : (
            <div className={styles.defaultImage}>
              <MusicNoteOutlined 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  color: '#1ED760'
                }} 
              />
            </div>
          )}
        </div>

        <div className={styles.info}>
          <p className={styles.typeLabel}>PLAYLIST</p>
          <h1 className={styles.name}>{playlist.name}</h1>
          {playlist.description && (
            <p className={styles.description}>{playlist.description}</p>
          )}
          <p className={styles.owner}>
            {userProfile?.images?.length ? (
              <img
                className={styles.ownerImage}
                src={userProfile?.images[0].url}
                alt={userProfile.display_name || "User"}
              />
            ) : (
              <div className={styles.ownerImagePlaceholder}>👤</div>
            )}
            <span className={styles.ownerText}>
              {userProfile?.display_name || "User"} {" • "}
              {playlist.tracks?.total || 0}{" "}
              {playlist.tracks?.total === 1 ? "song" : "songs"} {" • "}
              {formatDuration(totalDuration)}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlaylistDetailPage