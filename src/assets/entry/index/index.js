import Applications from "../../../views/partials/screens/applications/applications";
import Mailing from "../../../views/partials/screens/mailing/mailing";

[].slice.call(document.querySelectorAll('.applications')).forEach((block) => {
  new Applications(block);
});

[].slice.call(document.querySelectorAll('.mailing')).forEach((block) => {
  new Mailing(block);
});
