{
  description = "A very basic flake";

  outputs = { self, nixpkgs }:
    let
      pkgs = nixpkgs.legacyPackages.x86_64-linux;
    in
    {
      packages.x86_64-linux = rec {
        default = dev;
        dev = pkgs.writeShellScriptBin "dev" ''
          #!${pkgs.bash}/bin/bash
          ${pkgs.bun}/bin/bun install
          ${pkgs.bun}/bin/bun run dev
        '';
      };
      devShells.x86_64-linux.default = pkgs.mkShell {
        packages = with pkgs;[ git bun ];
      };
    };
}
