import Swal from "sweetalert2";

export const confirmAction = ({
  title = "Are you sure?",
  text = "",
  icon = "warning",
  confirmButtonText = "Yes",
  confirmButtonColor = "#3085d6",
  cancelButtonColor = "#d33",
} = {}) =>
  Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
  });
