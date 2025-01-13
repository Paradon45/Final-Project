import React from "react";

const GoogleMap = () => {
  return (
    <div style={{ overflow: "hidden", position: "relative", paddingTop: "56.25%" }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3822.4843579327426!2d102.6078995!3d16.6526285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x312244c53339c92b%3A0x3ff7ef97793cba7e!2z4LiI4Li44LiU4LiK4Lih4Lin4Li04Lin4Lir4Li04LiZ4LiK4LmJ4Liy4LiH4Liq4Li1!5e0!3m2!1sth!2sth!4v1734640354898!5m2!1sth!2sth"
        width="100%"
        height="100%"
        style={{ border: 0, position: "absolute", top: 0, left: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      ></iframe>
    </div>
  );
};

export default GoogleMap;
