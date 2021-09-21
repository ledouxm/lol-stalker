export const makePickRessource = (onPicked) =>
    function (nodeRessourcePicker) {
        const { document } = this.contentWindow;

        var ressourcesPicker = document.getElementById("ressourcesPicker");
        ressourcesPicker.style.display = "";
        var typeId = ressourcesPicker.getAttribute("data-type");
        var typeNode = document.getElementById("pickRessource" + typeId);
        var ressourceId = nodeRessourcePicker.getAttribute("data-ressourceId");

        typeNode.className += " ressourceSelected";
        typeNode.setAttribute("data-name", nodeRessourcePicker.lastChild?.nodeValue);
        typeNode.setAttribute("data-ressourceId", ressourceId);
        typeNode.innerHTML = "";
        this.contentWindow.updateVerbalRessources();

        this.contentWindow.getData(
            this.contentWindow.dns + "getRessourceData.php?ressourceId={0}&groupId={1}",
            [ressourceId, this.contentWindow.map?.options.data.id],
            this.contentWindow.addRessourceMarkers,
            { typeId: typeId }
        );

        onPicked(Number(ressourceId), typeId);
    };

export const makeClickOnTypePicker = (onUnpick) =>
    function (type) {
        const { document } = this.contentWindow;
        var typeNode = document.getElementById("pickRessource" + type);

        if (typeNode.className.indexOf("ressourceSelected") == -1) {
            var ressourcesPicker = document.getElementById("ressourcesPicker");
            ressourcesPicker.setAttribute("data-type", type);
            ressourcesPicker.style.display = "block";
        } else {
            typeNode.innerHTML = "?";
            typeNode.setAttribute("data-ressourceId", "");
            typeNode.setAttribute("data-name", "");
            typeNode.className = typeNode.className.replace(" ressourceSelected", "");
            typeNode.className = typeNode.className.replace(" loading", "");
            this.contentWindow.updateVerbalRessources();

            //remove corresponding the ressources markers
            this.contentWindow.removeRessourceMarkers(type);

            onUnpick(type);
        }
    };

export const makeMouseMoveOnMap = () =>
    function (e) {
        const { contentWindow } = this;
        contentWindow.coords = contentWindow.mapXYToDofusXY(e.latlng.lat, e.latlng.lng);
        contentWindow.x = Math.floor(contentWindow.coords[0]);
        contentWindow.y = Math.floor(contentWindow.coords[1]);
        var divCoordinates = contentWindow.document.getElementById("mapCoordinates");
        divCoordinates.innerHTML = contentWindow.x + ", " + contentWindow.y;
        if (contentWindow.objOnMap.staticMarkersOver) {
            divCoordinates.innerHTML +=
                '<br/><span style="font-size:12px;font-weight:normal;">' +
                contentWindow.objOnMap.staticMarkersOver +
                "</span>";
        }
        divCoordinates.style.top = e.containerPoint.y + 6 + "px";
        divCoordinates.style.left = e.containerPoint.x + 6 + "px";
        divCoordinates.style.display = "block";

        contentWindow.objOnMap.rectangle.setLatLng(
            contentWindow.dofusXYToMapXY(contentWindow.x, contentWindow.y)
        );
    };

export const makeZoomChangeOnMap = (onZoomChange) =>
    function (e) {
        const { contentWindow } = this;
        var iconRectangle = contentWindow.objOnMap.rectangle.options.icon;
        iconRectangle.options.iconSize = contentWindow.getRectangleOnMapSize();
        contentWindow.objOnMap.rectangle.setIcon(iconRectangle);

        contentWindow.mapContainer.setAttribute("data-zoom", e.target._animateToZoom);

        onZoomChange(contentWindow);
    };
