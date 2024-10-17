interface SceneDescriptionProps {
    title: string;
    description: string;
  }
  
  export const SceneDescription: React.FC<SceneDescriptionProps> = ({ title, description }) => {
    return (
      <div className="scene-description">
        <h3>{title}:</h3>
        <p style={{ whiteSpace: 'pre-line' }}>{description}</p>
      </div>
    );
  };

  export default SceneDescription;
