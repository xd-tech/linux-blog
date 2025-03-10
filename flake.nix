{
  description = "A very basic flake";

  inputs.nixpkgs.url = "github:nixos/nixpkgs?ref=nixpkgs-unstable";
  inputs.systems.url = "github:nix-systems/default";

  outputs =
    {
      self,
      nixpkgs,
      systems,
    }:
    let
      inherit (nixpkgs)lib;
      eachSystem = lib.genAttrs (import systems);
      pkgsFor = system: import nixpkgs { inherit system; };
    in
    {
      packages = eachSystem (
        system:
        let
          pkgs = pkgsFor system;
          bun = lib.getExe pkgs.bun;
        in
        rec {
          default = dev;
          dev = pkgs.writeShellScriptBin "dev" ''
            ${bun} install
            ${bun} run dev
          '';
          build = pkgs.writeShellScriptBin "build" ''
            ${bun} install
            ${bun} run build
          '';
        }
      );
      devShells = eachSystem (
        system:
        let
          pkgs = pkgsFor system;
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              git
              bun
              self.packages.${system}.dev
              self.packages.${system}.build
            ];
          };
        }
      );
    };
}
