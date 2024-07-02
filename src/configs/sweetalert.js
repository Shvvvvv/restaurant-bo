import Swal from "sweetalert2";

const swall = (icon, title, text = "", btnCancel = false, callback) => {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    showCancelButton: btnCancel,
    customClass: {
      container: "z-[99999]",
    },
  }).then((result) => {
    if (callback) {
      callback(result);
    }
  });
};

export default swall;
